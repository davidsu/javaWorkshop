package example;

import java.text.ParseException;
import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
/**
 * Created by Alon on 11/03/2017.
 */
public class Task
{
    private int m_id;
    private int m_taskTypeId;
    private int m_productId;
    private int m_envId;
    private int m_requesterId;
    private int m_priority;
    private Date m_openDate;
    private Date m_execDate;
    private String m_status;
    private boolean m_qaGO;
    private boolean m_rollBack;
    private boolean m_urgent;
    private String m_additionalInfo;
    private int m_additionalInfoId;
    private int m_assigneeId;
    private int m_resolvedById;

    public Task(int taskTypeId, int prodId, int envId, int requesterId, int priority, String openDate, String execDate, String status, boolean qaGo, boolean rollback,
                boolean urgent, String additionalInfo)
    {
        m_taskTypeId = taskTypeId;
        m_productId = prodId;
        m_envId = envId;
        m_requesterId = requesterId;
        m_priority = priority;
        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        if (openDate != null)
        {
            try {
                m_openDate = formatter.parse(openDate);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        m_status = status;
        m_qaGO = qaGo;
        m_rollBack = rollback;
        m_urgent = urgent;
        m_additionalInfo = additionalInfo;
    }

    public int getTaskTypeId()
    {
        return m_taskTypeId;
    }

    public int getProductId()
    {
        return m_productId;
    }

    public int getEnvId()
    {
        return m_envId;
    }

    public int getRequesterId()
    {
        return m_requesterId;
    }

    public int getPriority()
    {
        return m_priority;
    }

    public Date getOpenDate()
    {
        return m_openDate;
    }

    public String getStatus()
    {
        return m_status;
    }

    public boolean getQaGo()
    {
        return m_qaGO;
    }

    public boolean getRollback()
    {
        return m_rollBack;
    }

    public boolean getUrgent()
    {
        return m_urgent;
    }

    public String getAdditionalInfo()
    {
        return m_additionalInfo;
    }

}
